import {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import "dotenv/config";

const discordToken = process.env.DISCORD_TOKEN || "";

class LoggerService {
  private client: Client;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
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
}
const loggerService = new LoggerService();
export default loggerService;
