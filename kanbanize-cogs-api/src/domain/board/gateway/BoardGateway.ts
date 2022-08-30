import axios from "axios";

const API_V2_BASE_URL = `https://involves.kanbanize.com/api/v2`;

export interface FindBoardsInput {
  apiKey: string;
}

export interface FindBoardStructureInput {
  boardId: string;
  apiKey: string;
}

class BoardGateway {

  public async findBoards({ apiKey }: FindBoardsInput): Promise<any[]> {
    const { data } = await axios.get(`${API_V2_BASE_URL}/boards`,
      {
        headers: {
          'apikey': apiKey
        }
      }
    )
    return data.data;
  }

  public async findBoardStructure({ boardId, apiKey }: FindBoardStructureInput): Promise<any> {
    const { data } = await axios.get(`${API_V2_BASE_URL}/boards/${boardId}/currentStructure`,
      {
        headers: {
          'apikey': apiKey
        }
      }
    )
    return data.data;
  }

}

export default BoardGateway;
