import process from 'process';
import * as dotenv from 'dotenv';

export const DEFAULT_CONCURRENT_REQUESTS = 5;

export const MAX_PARALLEL_REQUESTS =
    +process.env.CONCURRENT_REQUESTS ||
    +dotenv.config().parsed?.CONCURRENT_REQUESTS ||
    DEFAULT_CONCURRENT_REQUESTS;

export const API_KEY = process.env.API_KEY || dotenv.config().parsed?.API_KEY;
