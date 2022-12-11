import { reactive, readonly, toRefs } from 'vue'

export type Level = 'easy' | 'medium' | 'hard'
export type State = 'ready' | 'play' | 'victory' | 'defeat'

export interface BoardMeta {
  w: number
  h: number
  m: number
}

export interface GridPosition {
  x: number
  y: number
}

export interface GridMeta {
  uid: number
  open: boolean
  flag?: boolean
  mine?: boolean
  boom?: boolean
  adjacentMines?: number
}

/* -------------------------------------------------------------------------- */

export const Presets = {
  level: {
    easy: [9 /** width */, 9 /** height*/, 10 /**mines */],
    medium: [16, 16, 40],
    hard: [30, 16, 99]
  }
}

/* -------------------------------------------------------------------------- */

export default function useGame() {
  const model = reactive(new GameModel())
  const { state, board, grids, flags } = toRefs(readonly(model))
  return {
    state,
    board,
    grids,
    flags,
    load: model.load.bind(model),
    ready: model.ready.bind(model),
    openAll: model.openAll.bind(model),
    openGrid: model.openGrid.bind(model),
    markGrid: model.markGrid.bind(model),
    uidToPos: model.uidToPos.bind(model),
    posToUid: model.posToUid.bind(model)
  }
}

/* -------------------------------------------------------------------------- */

class GameModel {
  board!: BoardMeta
  state: State = 'ready'
  grids: GridMeta[] = []
  mines: number[] = []
  flags: number[] = []

  constructor() {
    this.ready()
  }

  ready(): void
  ready(level: Level): void
  ready(board: BoardMeta): void
  ready(args?: Level | BoardMeta): void {
    if (typeof args === 'string') {
      const [w, h, m] = Presets['level'][args]
      this.board = { w, h, m }
    } else if (typeof args === 'object') {
      this.board = { ...args }
    } else {
      if (!this.board) {
        const [w, h, m] = Presets['level']['easy']
        this.board = { w, h, m }
      }
    }
    const length = this.board.w * this.board.h
    this.grids = Array.from({ length }, (_, index) => ({
      uid: index,
      open: false
    }))
    this.mines.length = 0
    this.flags.length = 0
    this.state = 'ready'
  }

  load(board: BoardMeta, grids: GridMeta[]) {
    this.state = 'play'
    this.board = { ...board }
    this.grids = grids.slice()
    this.mines.length = 0
    this.flags.length = 0
    this.grids.forEach(({ mine, flag }, index) => {
      mine && this.mines.push(index)
      flag && this.flags.push(index)
    })
  }

  posToUid(pos: GridPosition) {
    return pos.x + pos.y * this.board.w
  }

  uidToPos(uid: number): GridPosition {
    return {
      x: uid % this.board.w,
      y: Math.floor(uid / this.board.w)
    }
  }

  initMines(pos: GridPosition) {
    const { w, h, m } = this.board
    const excludes = [this.posToUid(pos)]
    shuffle([...Array(w * h).keys()], m, excludes).forEach(id => {
      this.grids[id]['mine'] = true
      this.mines.push(id)
    })
  }

  openGrid(pos: GridPosition) {
    if (!this.canISetGrid(pos)) {
      return
    }
    const uid = this.posToUid(pos)
    // patch
    if (this.grids[uid]['flag']) {
      this.markGrid(pos)
      return
    }
    this.grids[uid]['open'] = true
    if (this.grids[uid]['mine']) {
      this.grids[uid]['boom'] = true
      this.state = 'defeat'
      return
    }
    this.doAutoOpenFromZero(pos)
    this.doVictoryJudgement('open')
  }

  markGrid(pos: GridPosition) {
    if (!this.canISetGrid(pos)) {
      return
    }
    const uid = this.posToUid(pos)
    this.grids[uid]['flag'] = !this.grids[uid]['flag']
    const index = this.flags.indexOf(uid)
    if (index > -1) {
      this.flags.splice(index, 1)
    } else {
      this.flags.push(uid)
    }
    this.doVictoryJudgement('flag')
  }

  canISetGrid(pos: GridPosition): boolean {
    if (this.state == 'ready') {
      this.initMines(pos)
      this.state = 'play'
    }
    if (this.state != 'play') {
      return false
    }
    const uid = this.posToUid(pos)
    if (this.grids[uid]['open']) {
      return false
    }
    return true
  }

  openAll() {
    this.mines.forEach(id => {
      this.grids[id]['open'] = true
      this.grids[id]['mine'] = true
    })
  }

  doAutoOpenFromZero(pos: GridPosition) {
    if (this.getAdjacentMines(pos) != 0) {
      return
    }
    this.getSiblings(pos).forEach(grid => {
      if (!grid['open']) {
        grid['open'] = true
        this.doAutoOpenFromZero(this.uidToPos(grid['uid']))
      }
    })
  }

  doVictoryJudgement(mode: 'open' | 'flag') {
    let victory = false
    if (mode == 'open') {
      let count = this.mines.length
      this.grids.forEach(({ open }) => {
        open && count++
      })
      victory = count === this.grids.length
    } else if (mode == 'flag') {
      victory =
        this.mines.length == this.flags.length &&
        this.mines.every(id => this.flags.includes(id))
    }

    if (victory) {
      this.state = 'victory'
    }
  }

  getAdjacentMines(pos: GridPosition): number {
    const uid = this.posToUid(pos)
    const grid = this.grids[uid]
    if (grid['adjacentMines'] !== undefined) {
      return grid['adjacentMines']
    }
    let count = 0
    this.getSiblings(pos).forEach(({ mine }) => {
      mine && count++
    })
    grid['adjacentMines'] = count
    return count
  }

  getSiblings(pos: GridPosition): GridMeta[] {
    const result: GridMeta[] = []
    const { w, h } = this.board
    const vectors = [
      [1, 1],
      [1, 0],
      [1, -1],
      [0, 1],
      [0, -1],
      [-1, 1],
      [-1, 0],
      [-1, -1]
    ]
    vectors.forEach(([dx, dy]) => {
      const x = dx + pos.x
      const y = dy + pos.y
      if (x >= 0 && x < w && y >= 0 && y < h) {
        const uid = this.posToUid({ x, y })
        result.push(this.grids[uid])
      }
    })
    return result
  }
}

export function shuffle(source: number[], target: number, excludes?: number[]) {
  let length = source.length
  let result = source.slice()
  if (excludes && excludes.length) {
    for (let i = 0; i < excludes.length; i++) {
      length--
      _swap(excludes[i], length)
    }
  }
  for (let i = 0; i < target; i++) {
    _swap(_rand(i, length), i)
    length--
  }
  return result.slice(0, target)

  function _swap(l: number, r: number, arr = result) {
    ;[arr[l], arr[r]] = [arr[r], arr[l]]
  }
  // N ∈ [min, max)
  function _rand(min: number, max: number) {
    return min + Math.floor(Math.random() * (max - min))
  }
}
