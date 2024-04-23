
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
    // kept in order of the properties from Notion's database:
    let date = result.properties.PublishedDate.date?.start 
    let longDescription = result.properties.LongDescription.rich_text?.[0]?.plain_text
    let imageKey = result.properties.ImgHeroKey.rich_text?.[0]?.plain_text
    let searchTags = result.properties.SearchTags.multi_select.length > 0? result.properties.SearchTags.multi_select : undefined
    let authors = result.properties.ArticleAuthor.multi_select.length > 0? result.properties.ArticleAuthor.multi_select : undefined
    let shortDescription = result.properties.ShortDescription.rich_text?.[0]?.plain_text
    let subHeading = result.properties.SubHeading.rich_text?.[0]?.plain_text
    let articleStatus = result.properties.ArticleStatus.select?.name
    let image = result.properties.ImgHero.files.length > 0? result.properties.ImgHero.files : undefined
    let title = result.properties.ArticleHeading.title?.[0]?.plain_text

    articles.push({
      searchTags,
      badge: articleStatus,
      title,
      subHeading,
      authors,
      image,
      shortDescription,
      description: longDescription,
      date,
      imageKey,
    })
  })
  return articles
}

// THE TYPE AS DEFINED CURRENTLY FOR POST
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

export default defineEventHandler(() => pickArticlesData(payload));
// export default defineEventHandler(() => payload);
