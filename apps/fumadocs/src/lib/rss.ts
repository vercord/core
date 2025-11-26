import { Feed } from "feed";
import { source } from "@/lib/source";

const baseUrl = "https://fumadocs.dev";

export function getRSS() {
  const feed = new Feed({
    title: "Vercord Documentation",
    id: `${baseUrl}/docs`,
    link: `${baseUrl}/docs`,
    language: "en",
    image: `${baseUrl}/banner.png`,
    favicon: `${baseUrl}/icon.png`,
    copyright: "All rights reserved 2025, Vercord",
  });

  for (const page of source.getPages()) {
    feed.addItem({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      link: `${baseUrl}${page.url}`,
      date: new Date(),

      author: [
        {
          name: "kWAY",
        },
      ],
    });
  }

  return feed.rss2();
}
