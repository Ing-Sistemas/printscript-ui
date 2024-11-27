import {useMutation, UseMutationResult, useQuery} from 'react-query';
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from './snippet.ts';
import {PaginatedUsers} from "./users.ts";
import {TestCase} from "../types/TestCase.ts";
import {FileType} from "../types/FileType.ts";
import {Rule} from "../types/Rule.ts";
import {useAuth0} from "@auth0/auth0-react";
import {useEffect} from "react";
import {FantocheSnippetOperations} from "./real/FantocheSnippetOperations.ts";

export const useSnippetsOperations = () => {
    const { getAccessTokenSilently } = useAuth0()
    useEffect(() => {
        getAccessTokenSilently()
            .then(token => {
                localStorage.setItem('token', token)
            })
    });
}
const snippetOperations = new FantocheSnippetOperations();

export const useGetSnippets = (page: number = 0, pageSize: number = 10, snippetName?: string) => {
    return useQuery<PaginatedSnippets, Error>(['listSnippets', page, pageSize, snippetName], () => snippetOperations!.listSnippetDescriptors(page, pageSize, snippetName));
};

export const useGetSnippetById = (id: string) => {
    useSnippetsOperations();
    return useQuery<Snippet | undefined, Error>(['snippet', id], () => snippetOperations!.getSnippetById(id), {
        enabled: !!id, // This query will not execute until the id is provided
    });
};

export const useCreateSnippet = ({onSuccess}: {
    onSuccess: () => void
}): UseMutationResult<Snippet, Error, CreateSnippet> => {
    useSnippetsOperations();
    return useMutation<Snippet, Error, CreateSnippet>(createSnippet => snippetOperations!.createSnippet(createSnippet), {onSuccess});
};

export const useUpdateSnippetById = ({onSuccess}: { onSuccess: () => void }): UseMutationResult<Snippet, Error, {
    id: string;
    updateSnippet: UpdateSnippet
}> => {
    useSnippetsOperations();
    return useMutation<Snippet, Error, { id: string; updateSnippet: UpdateSnippet }>(
        ({id, updateSnippet}) => snippetOperations!.updateSnippetById(id, updateSnippet), {
            onSuccess,
        }
    );
};

export const useGetUsers = (name: string = "", page: number = 0, pageSize: number = 10) => {
    useSnippetsOperations();
    return useQuery<PaginatedUsers, Error>(['users', name, page, pageSize], () => snippetOperations!.getUserFriends(name, page, pageSize));
};

export const useShareSnippet = () => {
    useSnippetsOperations();
    return useMutation<Snippet, Error, { snippetId: string; userId: string }>(
        ({snippetId, userId}) => snippetOperations!.shareSnippet(snippetId, userId)
    );
};


export const useGetTestCases = (snippetId: string) => {
    useSnippetsOperations();
    return useQuery<TestCase[] | undefined, Error>('testCases', () => snippetOperations!.getTestCases(snippetId), {});
};


export const usePostTestCase = () => {
    useSnippetsOperations();
    return useMutation<TestCase, Error, Partial<TestCase>>(
        (tc) => snippetOperations!.postTestCase(tc)
    );
};


export const useRemoveTestCase = ({onSuccess}: { onSuccess: () => void }) => {
    useSnippetsOperations();
    return useMutation<string, Error, string>(
        ['removeTestCase'],
        (id) => snippetOperations!.removeTestCase(id),
        {
            onSuccess,
        }
    );
};

export type TestCaseResult = "success" | "fail"

export const useTestSnippet = () => {
    useSnippetsOperations();
    return useMutation<TestCaseResult, Error, Partial<TestCase>>(
        (tc) => snippetOperations!.testSnippet(tc)
    )
}


export const useGetFormatRules = () => {
    useSnippetsOperations();
    return useQuery<Rule[], Error>('formatRules', () => snippetOperations!.getFormatRules());
}

export const useModifyFormatRules = ({onSuccess}: { onSuccess: () => void }) => {
    useSnippetsOperations();
    return useMutation<Rule[], Error, Rule[]>(
        rule => snippetOperations!.modifyFormatRule(rule),
        {onSuccess}
    );
}


export const useGetLintingRules = () => {
    useSnippetsOperations();
    return useQuery<Rule[], Error>('lintingRules', () => snippetOperations!.getLintingRules());
}


export const useModifyLintingRules = ({onSuccess}: { onSuccess: () => void }) => {
    useSnippetsOperations();
    return useMutation<Rule[], Error, Rule[]>(
    rule => snippetOperations!.modifyLintingRule(rule),
        {onSuccess}
    );
}

export const useFormatSnippet = () => {
    useSnippetsOperations();
    return useMutation<string, Error, string>(
        snippetContent => snippetOperations!.formatSnippet(snippetContent)
    );
}

export const useDeleteSnippet = ({onSuccess}: { onSuccess: () => void }) => {
    useSnippetsOperations();
    return useMutation<string, Error, string>(
        id => snippetOperations!.deleteSnippet(id),
        {
            onSuccess,
        }
    );
}

export const useGetFileTypes = () => {
    useSnippetsOperations();
    return useQuery<FileType[], Error>('fileTypes', () => snippetOperations!.getFileTypes());
}