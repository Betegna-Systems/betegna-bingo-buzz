import { createSeededRNG, shuffle } from "@/lib/rng";
import { BingoGrid, generateBingoCard, hasBingo } from "@/lib/bingo";

// Lightweight event emitter
type Handler<T = any> = (payload: T) => void;
class Emitter {
  private map = new Map<string, Set<Handler>>();
  on(event: string, handler: Handler) {
    if (!this.map.has(event)) this.map.set(event, new Set());
    this.map.get(event)!.add(handler);
    return () => this.off(event, handler);
  }
  off(event: string, handler: Handler) {
    this.map.get(event)?.delete(handler);
  }
  emit(event: string, payload?: any) {
    this.map.get(event)?.forEach((h) => h(payload));
  }
}

export type RoomId = "room-20" | "room-30" | "room-40" | "room-50";
export interface Player {
  id: string;
  name: string;
  isBot?: boolean;
  cardId?: number; // 1..100
  ready?: boolean;
}
export interface RoomState {
  id: RoomId;
  entryFee: number;
  minPlayers: number;
  maxPlayers: number;
  countdown: number; // seconds to auto-start
  status: "waiting" | "starting" | "playing" | "ended";
  players: Player[];
  prizePoolEstimate: number; // derived
  game?: {
    deck: number[];
    drawnNumbers: number[];
    startedAt: number;
    endedAt?: number;
    winnerId?: string;
    pattern?: string;
  };
  chat: { id: string; user: string; text: string; ts: number }[];
}

const initialRooms: RoomState[] = [
  { id: "room-20", entryFee: 20, minPlayers: 2, maxPlayers: 50, countdown: 45, status: "waiting", players: [], prizePoolEstimate: 0, chat: [] },
  { id: "room-30", entryFee: 30, minPlayers: 2, maxPlayers: 50, countdown: 60, status: "waiting", players: [], prizePoolEstimate: 0, chat: [] },
  { id: "room-40", entryFee: 40, minPlayers: 2, maxPlayers: 50, countdown: 75, status: "waiting", players: [], prizePoolEstimate: 0, chat: [] },
  { id: "room-50", entryFee: 50, minPlayers: 2, maxPlayers: 50, countdown: 90, status: "waiting", players: [], prizePoolEstimate: 0, chat: [] },
];

class GameEngine {
  private emitter = new Emitter();
  private rooms = new Map<RoomId, RoomState>();
  private tickInterval?: number;
  public currentUser: Player;

  constructor() {
    initialRooms.forEach((r) => this.rooms.set(r.id, { ...r }));
    const storedName = localStorage.getItem("userName") || localStorage.getItem("userPhone") || "You";
    this.currentUser = { id: "me", name: storedName };

    // seed some bots so UI feels alive
    ["room-20", "room-30", "room-40", "room-50"].forEach((rid, idx) => {
      const rnd = createSeededRNG(1000 + idx);
      const botCount = 3 + Math.floor(rnd() * 4);
      const room = this.rooms.get(rid as RoomId)!;
      for (let i = 0; i < botCount; i++) {
        room.players.push({ id: `${rid}-bot-${i}`, name: `Bot${i + 1}`, isBot: true, ready: true, cardId: 1 + Math.floor(rnd() * 100) });
      }
      room.prizePoolEstimate = room.players.length * room.entryFee * 0.9; // after 10% fee
    });

    this.startTicker();
  }

  private startTicker() {
    if (this.tickInterval) return;
    this.tickInterval = window.setInterval(() => {
      this.rooms.forEach((room) => {
        if (room.status === "waiting" || room.status === "starting") {
          room.countdown = Math.max(0, room.countdown - 1);
          room.status = room.countdown <= 10 && room.players.length >= room.minPlayers ? "starting" : room.status;
          if (room.countdown === 0) {
            if (room.players.length >= room.minPlayers) {
              this.startGame(room.id);
            } else {
              // reset countdown when not enough players
              room.countdown = 30;
            }
          }
          this.emitter.emit("roomUpdated", { roomId: room.id, room });
        }
      });
    }, 1000);
  }

  on<T = any>(event: string, handler: Handler<T>) {
    return this.emitter.on(event, handler);
  }

  getRooms(): RoomState[] {
    return Array.from(this.rooms.values());
  }

  getRoom(roomId: RoomId): RoomState | undefined {
    return this.rooms.get(roomId);
  }

  joinRoom(roomId: RoomId) {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    const exists = room.players.some((p) => p.id === this.currentUser.id);
    if (!exists) {
      room.players.push({ ...this.currentUser, ready: false });
      room.prizePoolEstimate = room.players.length * room.entryFee * 0.9;
      this.emitter.emit("playerJoined", { roomId, player: this.currentUser });
      this.emitter.emit("roomUpdated", { roomId, room });
    }
    return true;
  }

  leaveRoom(roomId: RoomId) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    room.players = room.players.filter((p) => p.id !== this.currentUser.id);
    room.prizePoolEstimate = room.players.length * room.entryFee * 0.9;
    this.emitter.emit("playerLeft", { roomId, playerId: this.currentUser.id });
    this.emitter.emit("roomUpdated", { roomId, room });
  }

  selectCard(roomId: RoomId, cardId: number) {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    const me = room.players.find((p) => p.id === this.currentUser.id);
    if (!me) return false;
    me.cardId = cardId;
    return true;
  }

  ready(roomId: RoomId, isReady: boolean) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    const me = room.players.find((p) => p.id === this.currentUser.id);
    if (!me) return;
    me.ready = isReady;
    this.emitter.emit("roomUpdated", { roomId, room });
  }

  private startGame(roomId: RoomId) {
    const room = this.rooms.get(roomId)!;
    if (room.status === "playing") return;
    room.status = "playing";
    const deck = Array.from({ length: 75 }, (_, i) => i + 1);
    const rnd = createSeededRNG(Date.now() % 100000);
    room.game = { deck: shuffle(deck, rnd), drawnNumbers: [], startedAt: Date.now() };
    this.emitter.emit("gameStarted", { roomId });
    this.emitter.emit("roomUpdated", { roomId, room });

    // draw loop
    const drawNext = () => {
      if (!room.game || room.status !== "playing") return;
      const next = room.game.deck.shift();
      if (next === undefined) return this.endGame(roomId);
      room.game.drawnNumbers.push(next);
      this.emitter.emit("numberDrawn", { roomId, number: next, drawnNumbers: room.game.drawnNumbers.slice() });
      // keep drawing every 3s
      if (!room.game.endedAt) window.setTimeout(drawNext, 3000);
    };
    window.setTimeout(drawNext, 1500);
  }

  claimBingo(roomId: RoomId) {
    const room = this.rooms.get(roomId)!;
    if (!room || room.status !== "playing" || !room.game) return { ok: false, reason: "not_playing" };
    const me = room.players.find((p) => p.id === this.currentUser.id);
    if (!me || !me.cardId) return { ok: false, reason: "no_card" };
    const grid: BingoGrid = generateBingoCard(me.cardId);
    const result = hasBingo(grid, room.game.drawnNumbers);
    if (result) {
      room.game.winnerId = me.id;
      room.game.pattern = result.pattern;
      this.endGame(roomId);
      return { ok: true, pattern: result.pattern };
    }
    return { ok: false, reason: "invalid" };
  }

  private endGame(roomId: RoomId) {
    const room = this.rooms.get(roomId)!;
    if (!room.game) return;
    room.game.endedAt = Date.now();
    room.status = "ended";
    this.emitter.emit("gameEnded", { roomId, winnerId: room.game.winnerId, pattern: room.game.pattern });
    this.emitter.emit("roomUpdated", { roomId, room });
    // reset after short delay
    window.setTimeout(() => {
      room.status = "waiting";
      room.countdown = 45;
      room.game = undefined;
      // reset readiness and card selection for next round
      room.players.forEach((p) => { if (!p.isBot) { p.ready = false; p.cardId = undefined; } });
      this.emitter.emit("roomUpdated", { roomId, room });
    }, 5000);
  }

  sendChat(roomId: RoomId, text: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    const msg = { id: `${Date.now()}`, user: this.currentUser.name, text, ts: Date.now() };
    room.chat.push(msg);
    this.emitter.emit("chat", { roomId, message: msg });
  }
}

export const gameEngine = new GameEngine();
