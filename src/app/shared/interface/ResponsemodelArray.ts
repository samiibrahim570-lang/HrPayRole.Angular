export interface ResponseModel<T> {
    messageType: number;
    message: string;
    result: T;
    httpStatusCode: number;
    errors: string[] | null;
  }



  export interface ResponseModels<T> {
    messageType: number;
    message: string;
    result: T[];
    httpStatusCode: number;
    errors: string[] | null;
  }


  export interface ResponseModelArray<T> {
    messageType: number;
    message: string;
    result: T[];
    httpStatusCode: number;
    errors: string[] | null;
    endTime: any;
    length: number;
  }

  export interface PaginatedResult<T> {
    pageCount: number;
    currentPage: number;
    pageSize: number;
    rowCount: number;
    result: T[]; // Array of items
  }

  export interface ResponsePaginatedModel<T> {
    messageType: number;
    message: string;
    result: PaginatedResult<T>;
    httpStatusCode: number;
    errors: string[] | null;
  }



