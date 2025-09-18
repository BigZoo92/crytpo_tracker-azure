import { Context } from "@azure/functions";

export default async function (context: Context) {
  context.log("ingestTimer tick:", new Date().toISOString());
}
