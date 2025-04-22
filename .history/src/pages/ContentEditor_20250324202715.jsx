import { useState } from "react";
import ReactMarkdown from 'react-markdown'
import {Bold, Italic, Heading, Code, List, Link} from "lucide-react"

export default function ContentEditor () {
    const  [contentInput, setContentInput] = useState("")
    const [fontSize, setFontSize] = useState(16)

    const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 32))
    const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 12))

    const insertMarkdown = (syntax) => {
        setContentInput((prev) => prev + syntax)
    }

    return(
       <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-gray-200 p-6 ml-20">
       <div className="w=full md:w-1/2 p-4 border border-gray-700">
            <h1 className="text-2xl font-bold mb-4 text-gray-400">CONTENT </h1>

            <div className="mb-2 flex gap-2">
                <button className="bg-gray-700 px-3 py-1 rounded text-sm" onClick={decreaseFontSize}>A-</button>
                <button className="bg-gray-700 px-3 py-1 rounded text-sm" onClick={increaseFontSize}>A+</button>
                <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("**bold**")}><Bold size={18 }/></button> 
                <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("_italic_")}><Italic size={18 }/></button> 
                <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("#Heading")}><Heading size={18 }/></button> 
                <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("`code`")}><Code size={18 }/></button> 
                <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("- List Item")}><List size={18 }/></button> 
                <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("[Link](url)")}><Link size={18 }/></button> 
            </div>
            <textarea autoFocus
            className="w-full h-96 p-4 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={contentInput}
            onChange={(e) => setContentInput(e.target.value)}
            placeholder="Write article here...."></textarea>
        </div>
        <div className="w-full md:w-1/2 p-4">
            <h1 className="text-2xl font-bold mb-4 text-gray-400">PREVIEW</h1>
           <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg overflow-auto h-96 "> <ReactMarkdown className="text-gray-300" style={{fontSize: `${}`}}
            components={{code: ContentComponent}}/>
            </div>
        </div>
        </div>

    )
}

const ContentComponent = ({value}) => {
    return (
        <code className="bg-gray-700 p-1 rounded">{value}</code>
    )
}