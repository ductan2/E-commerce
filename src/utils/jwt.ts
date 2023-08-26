import jwt from 'jsonwebtoken';

export const generatorToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN })
}

export const generatorRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN })
}

