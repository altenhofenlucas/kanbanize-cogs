import axios, { AxiosResponse } from "axios";

const API_V1_BASE_URL = 'https://involves.kanbanize.com/index.php/api/kanbanize';

export interface FindCardsInput {
  boardId: string;
  apiKey: string;
}

export interface FindArchivedCardsInput {
  boardId: string;
  apiKey: string;
  filterStartDate: string;
}

export interface FindCardsDetailsInput {
  boardId: string;
  apiKey: string;
  cardIds: string[];
}

class CardGateway {

  public async findActiveCards({ boardId, apiKey }: FindCardsInput): Promise<any[]> {
    const { data }: AxiosResponse = await axios.post(`${API_V1_BASE_URL}/get_all_tasks`,
      {
        boardid: boardId,
      },
      {
        headers: {
          'apikey': apiKey
        }
      });

    return data;
  }

  public async findArchivedCards({ boardId, apiKey, filterStartDate }: FindArchivedCardsInput): Promise<any[]> {
    let archivedCards: any[] = [];
    let page = 1;
    const { data }: AxiosResponse = await axios.post(`${API_V1_BASE_URL}/get_all_tasks`,
      {
        boardid: boardId,
        textformat: "plain",
        container: "archive",
        fromdate: filterStartDate,
        page: page++
      },
      {
        headers: {
          'apikey': apiKey
        }
      });
    
    const { numberoftasks, tasksperpage, task } = data;
    const totalPages = Math.trunc( (numberoftasks / tasksperpage) ) + 1;
    
    archivedCards = archivedCards.concat(task);
    
    for (let currentPage = page; currentPage <= totalPages; currentPage++) {

      const { data }: AxiosResponse = await axios.post(`${API_V1_BASE_URL}/get_all_tasks`,
      {
        boardid: boardId,
        textformat: "plain",
        container: "archive",
        page: currentPage
      },
      {
        headers: {
          'apikey': apiKey
        }
      });
      const { task: taskPaged } = data;
      archivedCards = archivedCards.concat(taskPaged);
    }

    return archivedCards;
  }

  public async findCardsDetails({ boardId, apiKey, cardIds }: FindCardsDetailsInput): Promise<any[]> {
    const { data }: AxiosResponse = await axios.post(`${API_V1_BASE_URL}/get_task_details`,
      {
        boardid: boardId,
        taskid: cardIds,
        history: 'yes',
        comments: 'no',
        textformat: 'plain',
      },
      {
        headers: {
          'apikey': apiKey
        }
      });
    return data;
  }

}

export default CardGateway;
