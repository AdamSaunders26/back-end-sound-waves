export interface Wave {
  wave_id: number;
  title: string;
  wave_url: string;
  created_at: string;
  user_id: number;
  board_id: number;
  transcript: string;
  censor: boolean;
}

export interface Board {
  board_id: number;
  title: string;
  slug: string;
  created_at: string;
  user_id: number;
  description: string;
}

export interface User {
  user_id: number;
  username: string;
  email: string;
  avatar_url: string;
  password: string;
}

export interface Comment {
  comment: string;
  created_at: string;
  user_id: number;
  wave_id: number;
}
