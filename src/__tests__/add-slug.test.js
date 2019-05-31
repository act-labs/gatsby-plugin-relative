const slug = require("../add-slug");

describe("gatsby-plugin-relative", ()=>{
    it("content and pages in default directories", ()=>{
        const mockCwd = jest.spyOn(process, 'cwd').mockImplementation(() => "/dir/");
        expect(slug.getDefaultRoots()).toEqual(["/dir/src/content", "/dir/src/pages"])
        mockCwd.mockRestore();
    })

    it("added on Mdx and Yaml", ()=>{
        expect(slug.match(node({type:"Mdx"}))).toBe(true)
        expect(slug.match(node({type:"SomeYaml"}))).toBe(true)
        expect(slug.match(node({type:"SomeYaml"}), {endsWith:null})).toBe(false)        
        expect(slug.match(node({type:"MarkdownRemark"}))).toBe(true)
        expect(slug.match(node({type:"MarkdownRemark"}), {types:null})).toBe(false)                   
        expect(slug.match(node({type:"Page"}))).toBe(false)
    })    

    it("slug for file in subdirectory", ()=>{
        const roots = ["/dir1", "/dir2"];
        expect(slug.createFilePath({fileNode:node({absolutePath:"/dir2/other"}),roots})).toBe("/other/")
    })

    it("slug for file in subdirectory", ()=>{
        const roots = ["/dir1", "/dir2"];
        expect(slug.createFilePath({fileNode:node({absolutePath:"/dir2/other"}),roots, trailingSlash:false})).toBe("/other")
    })    

    it("no slug for file outside", ()=>{
        const roots = ["/dir1", "/dir2"];
        expect(slug.createFilePath({fileNode:node({absolutePath:"/dir3/other"}),roots})).toBeUndefined()
    })

})

function node({type, absolutePath}){
    return {internal:{type}, absolutePath}
}