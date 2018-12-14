export class History {
  protected history: string[] = []
  protected index = 0

  previous(): string {
    const index = this.index - 1
    if (index >= -1) {
      this.index = index
    }
    return this.history[index] || ''
  }

  next(): string {
    const index = this.index + 1
    if (index <= this.history.length) {
      this.index = index
    }
    return this.history[index] || ''
  }

  add(command: string) {
    this.history.push(command)
    this.index = this.history.length
  }

  clear() {
    this.history = []
    this.index = 0
  }
}
