import { TempRoles } from "./db";

export async function registerTempRoleTimeouts() {
	console.log("Registering temporal role timeouts...");
	const rolesToRemove = await TempRoles.getRolesToRemove();
	rolesToRemove.forEach((role) => {
		const timeout = Math.max(0, role.expiresOn - Date.now());
		console.log(
			`Found and registered temporal role id: ${role._id}. Removing in ${timeout}`,
		);
		setTimeout(() => {
			TempRoles.remove(role._id);
		}, timeout);
	});
	console.log("Temporal role timeouts registered!");
}
