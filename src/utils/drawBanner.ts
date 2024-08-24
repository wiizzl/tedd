import { createCanvas, loadImage } from "@napi-rs/canvas";
import { GuildMember } from "discord.js";

export async function drawBanner(target: GuildMember, userDB: any) {
    const canvas = createCanvas(800, 200);
    const context = canvas.getContext("2d");

    // const background = await loadImage(userDB?.banner ? userDB?.banner : "https://i.imgur.com/wmZhv6K.png");
    const background = await loadImage("https://i.postimg.cc/L5G6dzWt/test.webp");
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    const logo = await loadImage(target.user.avatarURL()!);
    const logoSize = Math.min(canvas.height, canvas.width / 3);
    context.drawImage(logo, 0, 0, logoSize, logoSize);

    context.font = "30px Arial";
    context.textAlign = "left";
    context.textBaseline = "middle";

    const nameText = target.user.displayName!;
    const backgroundColor = "rgba(0, 0, 0, 0.4)";

    const textX = logoSize + 10;
    const textY = canvas.height / 2 - 50;
    const textWidth = context.measureText(nameText).width + 20;
    const textHeight = 40;

    context.fillStyle = backgroundColor;
    context.fillRect(textX - 10, textY - textHeight / 2, textWidth, textHeight);
    context.fillStyle = "white";
    context.fillText(nameText, textX, textY);

    if (userDB?.clan.tag) {
        const clanTag = userDB?.clan.tag;

        const clanTagWidth = context.measureText(clanTag).width;
        const bracketsWidth = context.measureText("[]").width;
        const clanTextWidth = clanTagWidth + bracketsWidth + 20;
        const clanTextY = textY + textHeight / 2 + 25;

        context.fillStyle = backgroundColor;
        context.fillRect(textX - 10, clanTextY - textHeight / 2, clanTextWidth, textHeight);

        context.fillStyle = "white";
        context.fillText("[", textX, clanTextY);
        context.fillText("]", textX + bracketsWidth + clanTagWidth - 8, clanTextY);

        context.fillStyle = userDB?.clan.color;
        context.fillText(clanTag, textX + bracketsWidth / 2, clanTextY);
    }

    return canvas.encode("png");
}
