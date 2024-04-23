
import { Client } from "@notionhq/client"

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const articles_database_id = process.env.NOTION_DATABASE_KEY

let payload = []

async function getArticles() {
  const data = await notion.databases.query({
    database_id: articles_database_id
  })
  return data
}

getArticles().then((data) => {
  payload = data.results
})

function pickArticlesData(results) {
  let articles = []
  results.forEach((result) => {
    let date = result.properties.PublishedDate.date?.start 
    let longDescription = result.properties.LongDescription.rich_text?.[0]?.plain_text
    let imageKey = result.properties.ImgHeroKey.rich_text?.[0]?.plain_text
    let searchTags = result.properties.SearchTags.multi_select

    articles.push({
      // title: title,
      searchTags,
      description: longDescription,
      date,
      imageKey,
      // image:
      // badge:
      // author: 
    })
  })
  return articles
}

// export interface BlogPost extends ParsedContent {
//   title: string
//   description: string
//   date: string
//   image?: HTMLImageElement
//   badge?: Badge
//   authors?: ({
//     name: string
//     description?: string
//     avatar?: Avatar
//   } & Link)[]
// }

// export default defineEventHandler(() => pickArticlesData(payload));
export default defineEventHandler(() => payload);
