import { Context } from '../../config';
import { ChatComment, Message, MessageUser } from '../../models';

export class ChatHttpService {
  static async getAsync(ctx: Context): Promise<Response> {
    try {
      const list = (await ctx.get('origin').getAsync<ChatComment[]>()) ?? [];
      const names = new Map<string, MessageUser>();
      const messages: Message[] = [];

      for (const item of list) {
        messages.push(await convertMessage(ctx, item, names));
      }

      return ctx.json(messages);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get chat info', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
  static async postAsync(ctx: Context): Promise<Response> {
    try {
      const body = await ctx.req.json();
      const response = await ctx.get('origin').postAsync(body);
      const record: ChatComment = await response.json();

      console.log(record);

      return ctx.json(await convertMessage(ctx, record));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get chat info', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}

async function convertMessage(ctx: Context, item: ChatComment, users?: Map<string, MessageUser>): Promise<Message> {
  const author = item.author;

  if (users?.has(author)) {
    return {
      author: users.get(author)!,
      text: item.text,
      timestamp: item.timestamp,
    };
  }
  const user = await ctx.get('data').users.getAsync(author);
  let mUser: MessageUser = {
    id: author,
    name: user?.name ?? 'Unknown User',
    avatarUrl: user?.picture,
  };

  if (users) users.set(author, mUser);

  return {
    author: mUser,
    text: item.text,
    timestamp: item.timestamp,
  };
}
