import { TempRoles } from "./database/tempRoles";

export async function registerTempRoleTimeouts() {
	console.log("Registering temporal role timeouts...");
	const rolesToRemove = await TempRoles.getRolesToRemove();
	rolesToRemove.forEach((role) => {
		const timeout = Math.max(0, role.expires_on.getTime() - Date.now());
		console.log(
			`Found and registered temporal role id: ${role.id}. Removing in ${timeout}`,
		);
		setTimeout(() => {
			TempRoles.remove(role.id);
		}, timeout);
	});
	console.log("Temporal role timeouts registered!");
}
