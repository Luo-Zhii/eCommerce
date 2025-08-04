import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import "dotenv/config";

const discordToken = process.env.DISCORD_TOKEN || "";

class LoggerService {
  private client: Client;
  private channelId: string | undefined;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.channelId = process.env.DISCORD_CHANNELID;
    this.client.on("ready", () => {
      if (this.client.user) {
        console.log(`Logged in as ${this.client.user.tag}!`);
      } else {
        console.log("Logged in, but client.user is null.");
      }
    });

    this.client.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
      }
    });

    this.client.login(discordToken);

    this.client.on("messageCreate", (msg) => {
      if (msg.author.bot) return;
      if (msg.content === "hello") {
        msg.reply({
          content: "Hello! How can I assits you?",
        });
      }
    });
  }
  sendToFormatCode(logData: any) {
    const {
      code,
      message = "This is a log message",
      title = "Log Message",
    } = logData;

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16),
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };

    this.sendToMessage(codeMessage);
  }

  sendToMessage(message: any) {
    if (!this.channelId) {
      console.error("Discord channel ID is not defined.");
      return;
    }

    const channel = this.client.channels.cache.get(this.channelId);
    const textChannel = channel as TextChannel;

    if (!channel) {
      console.error("Couldn't find channel!!");
      return;
    }

    if (channel.isTextBased()) {
      try {
        textChannel.send(message);
      } catch (err) {
        console.error("Failed to send message:", err);
      }
    } else {
      console.error("Channel is not text-based. Can't send messages.");
    }
  }
}
const loggerService = new LoggerService();
export default loggerService;
