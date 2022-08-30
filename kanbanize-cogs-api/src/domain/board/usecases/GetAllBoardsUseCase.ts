import BoardGateway from "../gateway/BoardGateway";

import { GetAllBoardsInput } from "../input/GetAllBoardsInput";
import { BoardOutput } from "../output/BoardOutput";

class GetAllBoardsUseCase {

  gateway: BoardGateway;

  constructor() {
    this.gateway = new BoardGateway();
  }

  public async execute({ apiKey }: GetAllBoardsInput): Promise<BoardOutput[]> {
    try {
      const boardsFounded = await this.gateway.findBoards({ apiKey });
      const boards: BoardOutput[] = boardsFounded.map(board => {
        return {
          id: board.board_id,
          name: board.name,
          active: !board.is_archived,
        }
      });

      return boards
    } catch (error) {
      console.log(error);
    }
  }
}

export default GetAllBoardsUseCase;
