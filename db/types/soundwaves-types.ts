export interface Wave {
  wave_id: number;
  title: string;
  wave_url: string;
  created_at: string;
  username: string;
  board_name: string;
  transcript: string;
  censor: boolean;
}

export interface Board {
  board_name: string;
  board_slug: string;
  created_at: string;
  username: string;
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
  username: string;
  wave_id: number;
}
