import { createCanvas, loadImage } from "@napi-rs/canvas";
import { GuildMember } from "discord.js";

export async function drawBanner(target: GuildMember, userDB: any) {
    const canvas = createCanvas(800, 200);
    const context = canvas.getContext("2d");

    const background = await loadImage("https://i.imgur.com/wmZhv6K.png");
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    const logo = await loadImage(target.user.avatarURL()!);
    const logoSize = Math.min(canvas.height, canvas.width / 3);
    context.drawImage(logo, 0, 0, logoSize, logoSize);

    context.font = "30px Arial";
    context.textAlign = "left";
    context.textBaseline = "middle";

    const nameText = target.user.displayName!;
    const textColor = "white";
    const backgroundColor = "rgba(0, 0, 0, 0.4)";

    const textX = logoSize + 10;
    const textY = canvas.height / 2 - 50;
    const textWidth = context.measureText(nameText).width + 20;
    const textHeight = 40;

    context.fillStyle = backgroundColor;
    context.fillRect(textX - 10, textY - textHeight / 2, textWidth, textHeight);
    context.fillStyle = textColor;
    context.fillText(nameText, textX, textY);

    if (userDB?.clan) {
        const clanText = `[${userDB?.clan}]`;

        const clanTextWidth = context.measureText(clanText).width + 20;
        const clanTextY = textY + textHeight / 2 + 25;

        context.fillStyle = backgroundColor;
        context.fillRect(textX - 10, clanTextY - textHeight / 2, clanTextWidth, textHeight);
        context.fillStyle = textColor;
        context.fillText(clanText, textX, clanTextY);
    }

    return canvas.encode("png");
}
