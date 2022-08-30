import { Request, Response, Router } from 'express';
import GetAllBoardsUseCase from '../domain/board/usecases/GetAllBoardsUseCase';
import { BoardOutput } from '../domain/board/output/BoardOutput';
import GetBoardStructureUseCase from '../domain/board/usecases/GetBoardStructureUseCase';
import { BoardStructureOutput } from '../domain/board/output/BoardStructureOutput';
import GetBoardAnalysisUseCase from '../domain/analysis/usecases/GetBoardAnalysisUseCase';
import { BoardAnalysisOutput } from '../domain/analysis/output/BoardAnalysisOutput';
import GetBoardAnalysisReportUseCase from '../domain/analysis/usecases/GetBoardAnalysisReportUseCase';
import { BoardAnalysisFileOutput } from '../domain/analysis/output/BoardAnalysisFileOutput';

const boardsRouter = Router();

boardsRouter.get("/", async (request: Request, response: Response) => {
  const getAllBoardsUseCase = new GetAllBoardsUseCase();
  const boards: BoardOutput[] = await getAllBoardsUseCase.execute({
    apiKey: request.get('apikey')
  });

  return response.json(boards);
})

boardsRouter.get("/:id", async (request: Request, response: Response) => {
  const getBoardStructureUseCase = new GetBoardStructureUseCase();
  const boardStructure: BoardStructureOutput = await getBoardStructureUseCase.execute({
    boardId: request.params.id,
    apiKey: request.get('apikey'),
  });

  return response.json(boardStructure);
})

boardsRouter.get("/:id/analysis", async (request: Request, response: Response) => {
  try {
    const { initialDate, endDate, columns } = request.query;

    const columnsIds: number[] = columns.toString().split(',').map(Number)

    const getBoardAnalysisUseCase = new GetBoardAnalysisUseCase();
    const boardAnalysis: BoardAnalysisOutput = await getBoardAnalysisUseCase.execute({
      apiKey: request.get('apikey'),
      boardId: request.params.id,
      initialAnalysisDate: initialDate as string,
      endAnalysisDate: endDate as string,
      selectedColumnsIds: columnsIds,
    });

    const createBoardAnalysisFileUseCase = new GetBoardAnalysisReportUseCase();
    const { fileName, filePath }: BoardAnalysisFileOutput = await createBoardAnalysisFileUseCase.execute(boardAnalysis);

    response.download(filePath, fileName, (err) => {
      createBoardAnalysisFileUseCase.removeFile(filePath);
    });
  } catch (error) {
    console.log(error);
    return response.json({ message: 'Error on execute board analysis' })
  }
})

export { boardsRouter }
