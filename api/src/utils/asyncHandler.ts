import { AsyncHandler } from '../types/types';

const asyncHandler: AsyncHandler = (controllerFn) => {
    return async (req, res, next) => {
        try {
            await controllerFn(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}

export default asyncHandler