import {CreateSnippet, SnippetRequestCreate} from "../snippet.ts";

export const transformSnippet = (createSnippet: CreateSnippet): SnippetRequestCreate => {
    return {
        title: createSnippet.name,
        language: createSnippet.language,
        extension: createSnippet.extension,
        code: createSnippet.content,
        version: "1.1" // TODO raro pq createSnippet no tiene version
    };
}