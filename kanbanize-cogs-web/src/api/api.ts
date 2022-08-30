import axios, { AxiosResponse } from "axios";
import { Board } from "../pages/BoardAnalysis";

const baseURL = import.meta.env.VITE_API_URL;

export async function doLogin(email: string, password: string): Promise<any> {
  const { data } :AxiosResponse = await axios.post(`${baseURL}/login`, {
      email,
      password,
    });
  return data;
}

export type FetchAllBoardResponse = {
  boards: Board[]
}

export async function fetchAllBoard(apiKey: string): Promise<FetchAllBoardResponse> {
  const { data } :AxiosResponse = await axios.get(`${baseURL}/boards`, {
        headers: {
          'apikey': apiKey
        }
      });
  return { boards: data };
}

export type FetchBoardResponseColumn = {
  id: number,
  workflowId: number,
  name: string,
}

export type FetchBoardResponseWorkflow = {
  id: number,
  name: string,
  position: number,
  active: number,
  columns: FetchBoardResponseColumn[],
}

export type FetchBoardResponse = {
  name: string,
  active: boolean,
  workflows: FetchBoardResponseWorkflow[],
}

export async function fetchBoard(boardId: number | string, apiKey: string): Promise<FetchBoardResponse> {
  const { data } :AxiosResponse = await axios.get(`${baseURL}/boards/${boardId}`, {
        headers: {
          'apikey': apiKey
        }
      });
  return data;
}

type DoAnalysisProps = {
  boardId: number,
  columns: number[],
  startDate: string,
  endDate: string
}

export async function doAnalysis({boardId, columns, startDate, endDate}: DoAnalysisProps, apiKey: string): Promise<Blob> {
  const userLocale =
      navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language;

  const { data }: AxiosResponse = await axios.get(`${baseURL}/boards/${boardId}/analysis`, {
      params: {
        startDate,
        endDate,
        columns,
      },
      headers: {
        'apikey': apiKey,
        'locale': userLocale
      }
    });

  return new Blob([data], { type: 'text/csv;charset=utf-8;' });
}
