import { TempRoles } from "./db";

export async function registerTempRoleTimeouts() {
	console.log("Registering temporal role timeouts...");
	const rolesToRemove = await TempRoles.getRolesToRemove();
	rolesToRemove.forEach((role) => {
		console.log(`Found and registered temporal role id: ${role._id}`);
		setTimeout(() => {
			TempRoles.remove(role._id);
		}, Date.now() - role.expiresOn);
	});
	console.log("Temporal role timeouts registered!");
}
