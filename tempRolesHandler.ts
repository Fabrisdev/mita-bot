import { TempRoles } from "./database/tempRoles";
import { Log } from "./log";

export async function registerTempRoleTimeouts() {
	Log.log("Registering temporal role timeouts...");
	const rolesToRemove = await TempRoles.getRolesToRemove();
	rolesToRemove.forEach((role) => {
		const timeout = Math.max(0, role.expires_on.getTime() - Date.now());
		Log.log(
			`Found and registered temporal role id: ${role.id}. Removing in ${timeout}`,
		);
		setTimeout(() => {
			TempRoles.remove(role.id);
		}, timeout);
	});
	Log.log("Temporal role timeouts registered!");
}
