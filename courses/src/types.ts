export interface Course {
  title: string
  units: Unit[]
}

export interface Unit {
  title: string
  chapters: Chapter[]
}

export interface Chapter {
  title: string
  video: {
    file: {
      url: string
    }
  }
  chapterContent: ChapterContentNode
  coverImageURL?: string
}

interface ChapterContentNode {
  content: ContentNode[]
}

interface ContentNode {
  content: ContentObj[]
}

interface ContentObj {
  value: string
}

export interface CourseNode {
  node: {
    title: string
    units: Unit[]
  }
}
