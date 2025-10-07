import {instance} from "../src/common/instance/instance";

export const authApi = {
    login() {
        return instance.post("")
    }
}