export interface CharData {
    character: string
    imgSrc: string,
    moveList: Array<Move>
}

export interface Move {
    command: string
    hitLevel: string
    damage: string
    startUp: string
    blockFrame: string
    hitFrame: string
    counterFrame: string
    notes: string
}