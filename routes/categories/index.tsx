import { define } from "../../utils.ts";
import { Redirect } from "../../components/Redirect.tsx";

// Alt-URL /categories/ aus Chirpy → Tags (Kategorien sind jetzt Tags).
export default define.page(() => <Redirect to="/tags" />);
