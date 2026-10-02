import { define } from "../utils.ts";
import { Redirect } from "../components/Redirect.tsx";

// Alt-URL /archives/ aus Chirpy → Postliste.
export default define.page(() => <Redirect to="/posts" />);
