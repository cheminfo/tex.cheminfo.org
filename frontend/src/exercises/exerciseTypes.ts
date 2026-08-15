export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  /** Stable, URL-safe; it is what `/exercises/<id>` carries. */
  id: string;
  title: string;
  level: Level;
  /** What the student is asked to write, in one or two sentences. */
  prompt: string;
  /**
   * The formula to reproduce. It is rendered as the goal and revealed as
   * source only when the student asks for the solution.
   */
  solution: string;
  /** Ordered vague → specific; the last one may be almost the answer. */
  hints: string[];
  /**
   * Answers that are accepted although they render differently — a second
   * notation a teacher would mark correct.
   * @default []
   */
  alternatives?: string[];
  /**
   * Prefilled in the editor, so a long formula does not start from nothing.
   * @default ''
   */
  starter?: string;
  /** Commands worth reaching for, shown as one-click inserts. @default [] */
  commands?: string[];
}

export interface ExerciseSeries {
  /** Stable and URL-safe. */
  id: string;
  title: string;
  /** One line on what the series drills. */
  description: string;
  level: Level;
  exercises: Exercise[];
}
