export interface Wave {
    wave_id: number,
    title: string,
    wave_url: string,
    created_at: string,
    user_id: number,
    board_id: number,
    transcript: string,
    censor: boolean
}

export interface Board {
    board_id: number,
    title: string,
    slug: string,
    created_at: string,
    user_id: number,
    description: string,
}
