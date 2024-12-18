import {SnippetOperations} from "../snippetOperations.ts";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "../snippet.ts";
import {FileType} from "../../types/FileType.ts";
import {Rule} from "../../types/Rule.ts";
import {TestCase} from "../../types/TestCase.ts";
import {TestCaseResult} from "../queries.tsx";
import {PaginatedUsers} from "../users.ts";
import {BACKEND_URL} from "../constants.ts";
import axios from "axios";
import {transformSnippet} from "../conversion/conversion.ts";

export class FantocheSnippetOperations implements SnippetOperations {

    token: Promise<string>

    constructor(tokenString: Promise<string>) {
        this.token = tokenString;
    }

    async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
        try {
            const url = `${BACKEND_URL}/create`;
            const data = transformSnippet(createSnippet);
            const res = await axios.post(url, data, {
                headers: {
                    'Authorization': `Bearer ${await this.token}`,
                },
            });
            return res.data.snippetEntity; // TODO ver si esto esta bien
        } catch (e) {
            console.log("Failed to create snippet", e);
            throw e;
        }
    }

    async deleteSnippet(id: string): Promise<string> {
        try {
            const url = `${BACKEND_URL}/delete/${id}`;
            await axios.delete(url, {
                headers: {
                    'Authorization': `Bearer ${await this.token}`,
                },
            });
            return "Snippet deleted successfully";
        } catch (e) {
            console.log("Error deleting snippet", e);
            throw e;
        }
    }

    async getSnippetById(id: string): Promise<Snippet | undefined> {
        try {
            const url = `${BACKEND_URL}/get/${id}`;
            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${await this.token}`,
                }
            });
            return res.data
        } catch (e) {
            console.log("Error getting snippet", e);
            throw e;
        }
    }

    async updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
        try {
            const url = `${BACKEND_URL}/update/${id}`;
            const res = await axios.put(url, updateSnippet, {
                headers: {
                    'Authorization': `Bearer ${await this.token}`,
                },
            });
            return res.data;
        } catch (e) {
            console.log("Error updating snippet", e);
            throw e;
        }
    }

    async shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
        try {
            const url = `${BACKEND_URL}/share`;
            const data = {
                snippetId: snippetId,
                userId: userId,
            };
            const res = await axios.post(url, data, {
                headers: {
                    'Authorization': `Bearer ${await this.token}`,
                },
            });
            return res.data;
        } catch (e) {
            console.log("Error sharing snippet", e);
            throw e;
        }
    }
    async listSnippetDescriptors(page: number, pageSize: number, snippetName?: string | undefined): Promise<PaginatedSnippets> {
        try {
            const url = `${BACKEND_URL}/get_all`;
            const params = { page, pageSize, snippetName };
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${await this.token}`,
                }, params
            });

            const data = res.data;
            console.log(res.data.snippets[0])
            return {
                snippets: data.snippets, //hacer el map
                page: data.pagination.page,
                page_size: data.pagination.pageSize,
                count: data.pagination.count
            };
        } catch (e) {
            console.log("Error listing snippets", e);
            throw e;
        }
    }

    async getUserFriends(name?: string | undefined, page?: number | undefined, pageSize?: number | undefined): Promise<PaginatedUsers> {
         try {
            const url = `${BACKEND_URL}/get_users`;
            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${await this.token}`,
                },
                params: {
                    name,
                    page,
                    pageSize,
                }
            });
            return Promise.resolve(res.data);
        } catch (e) {
             console.log("Error getting user friends", e);
             throw e;
         }
    }

    // ------------------- TEST CASES -------------------
    async getTestCases(snippetId: string): Promise<TestCase[]> {
        try {
            const url = `${BACKEND_URL}/test/${snippetId}`;
            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${await this.token}`,
                }
            });

            return Promise.resolve(res.data);
        } catch (e) {
            console.log("Error getting test cases", e);
            throw e;
        }

    }
    async postTestCase(testCase: Partial<TestCase>, sId: string): Promise<TestCase> {
        try {
            const url = `${BACKEND_URL}/test`;
            const res = await axios.put(url, testCase, {
                headers: {
                    'Authorization': `Bearer ${await this.token}`,
                },
                params: { sId }
            });
            return res.data;
        } catch (e) {
            console.log("Error posting test case", e);
            throw e;
        }
    }

    async removeTestCase(id: string): Promise<string> {
        try {
            const url = `${BACKEND_URL}/test/${id}`;
            await axios.delete(url, {
                headers: {
                    'Authorization': `Bearer ${await this.token}`,
                }
            });
            return "Test case removed successfully";
        } catch (e) {
            console.log("Error removing test case", e);
            throw e;
        }
    }
    async testSnippet(testCase: Partial<TestCase>, sId: string): Promise<TestCaseResult> {
        try {
            const url = `${BACKEND_URL}/test/run_tests/${sId}`;
            const res = await axios.put(url, testCase, {
                headers: {
                    'Authorization': `Bearer ${await this.token}`,
                }
            });
            return res.data.toLowerCase();
        } catch (e) {
            console.log("Error testing snippet", e);
            throw e;
        }
    }
    getFileTypes(): Promise<FileType[]> {
        const fileTypes: FileType[] = [
            { language: "PrintScript", extension: "ps" },
            { language: "Python", extension: "py" },
            { language: "Kotlin", extension: "kt" },
        ]
        return Promise.resolve(fileTypes);
    }

    // ------------------- FORMAT CASES -------------------
    async getFormatRules(): Promise<Rule[]> {
        try {
            const url = `${BACKEND_URL}/format/rules`;
            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${await this.token}`,
                }
            });
            return res.data;
        } catch (e) {
            console.log("Error getting format rules", e);
            throw e;
        }
    }

    async modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
        return this.modifyRule(newRules, 'FORMAT');
    }

    async formatSnippet(snippetId: string): Promise<string> {
        try {
            const url = `${BACKEND_URL}/format/${snippetId}`;

            const res = await axios.post(
                url,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${await this.token}`,
                    },
                }
            );
            console.log(res.data);
            return "Snippet formatted successfully";
        } catch (e) {
            console.log("Error formatting snippet", e);
            throw e;
        }
    }

    // ------------------- LINT CASES -------------------
    async modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        return this.modifyRule(newRules, 'LINT');
    }
    async getLintingRules(): Promise<Rule[]> {
        try {
            const url = `${BACKEND_URL}/lint/rules`;
            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${await this.token}`,
                }
            });
            return res.data;
        } catch (e) {
            console.log("Error getting linting rules", e);
            throw e;
        }
    }

    private async modifyRule(newRules: Rule[], type: 'FORMAT' | 'LINT'): Promise<Rule[]> {
        try {
            const url = `${BACKEND_URL}/${type}`;
            console.log(`URL ASDASDASD ${url}`);

            const res = await axios.put(url, newRules, {
                headers: {
                    'Authorization': `Bearer ${await this.token}`,
                }
            });
            return res.data;
        } catch (e) {
            console.log(`Error modifying ${type} rule`, e);
            throw e;
        }
    }

}