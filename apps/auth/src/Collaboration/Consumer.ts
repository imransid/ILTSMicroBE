import * as jwt from 'jsonwebtoken';

async function validateTokenFromTutorial(token: string): Promise<boolean> {
  if (!token) {
    console.error('No token provided');
    return false; // Return false if no token is provided
  }

  try {
    console.log('token', token);

    // Remove "Bearer " if it exists
    const withoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;

    const decodedToken = jwt.decode(withoutBearer);
    console.log('Decoded Token:', decodedToken);

    console.log('withoutBearer', withoutBearer);

    // Verify the token
    jwt.verify(withoutBearer, process.env.JWT_SECRET as string);
    return true; // Return true if the token is valid
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return false; // Return false if verification fails
  }
}

export default validateTokenFromTutorial;
