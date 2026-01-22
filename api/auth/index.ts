import { jwtVerify } from "jose";
import { jwtSecret } from "../../environment";

export async function withUserId({ bearer }: { bearer: string | undefined }) {
	const verifyResult = await jwtVerify(bearer as string, jwtSecret());
	const { id } = verifyResult.payload as { id: string };
	return {
		userId: id,
	};
}
