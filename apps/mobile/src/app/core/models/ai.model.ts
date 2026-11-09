export interface HintResponse {
  level: number;
  text: string;
}

export interface ExplainErrorResponse {
  explanation: string;
}

export interface PlacementQuestion {
  prompt: string;
  options: string[];
}

export interface PlacementAnswer {
  questionIndex: number;
  selectedIndex: number;
}

export interface PlacementSubmitResult {
  assignedDifficulty: number;
}
