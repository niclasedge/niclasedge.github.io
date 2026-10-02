import { HttpError, page } from "fresh";
import { define } from "../../utils.ts";
import { getTag } from "../../lib/posts.ts";
import { Redirect } from "../../components/Redirect.tsx";

// Alt-URL /categories/<c>/ aus Chirpy → /tags/<c>.
export const handler = define.handlers({
  GET(ctx) {
    const tag = getTag(ctx.params.category);
    if (!tag) throw new HttpError(404);
    return page({ to: `/tags/${tag.slug}` });
  },
});

export default define.page<typeof handler>(({ data }) => (
  <Redirect to={data.to} />
));
