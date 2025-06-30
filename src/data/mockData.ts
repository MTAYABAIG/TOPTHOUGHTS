export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  youtubeUrl?: string;
  createdAt: string;
  author?: string;
}

export const mockPosts: BlogPost[] = [
  {
    _id: '1',
    title: 'The Future of Web Development: Trends to Watch in 2025',
    content: `Web development continues to evolve at a rapid pace, and 2025 promises to bring exciting new developments that will shape how we build and interact with digital experiences.

From the rise of AI-powered development tools to the growing importance of Web3 technologies, developers need to stay ahead of the curve to remain competitive in this dynamic field.

One of the most significant trends we're seeing is the integration of artificial intelligence in the development process. AI-powered code completion, automated testing, and intelligent debugging tools are becoming standard in many development workflows.

Server-side rendering (SSR) and static site generation (SSG) continue to gain traction as developers seek to optimize performance and improve SEO. Frameworks like Next.js, Nuxt.js, and SvelteKit are leading the charge in this area.

The JAMstack architecture has matured significantly, offering developers a way to build fast, secure, and scalable websites. This approach separates the frontend from the backend, allowing for greater flexibility and performance.

Progressive Web Apps (PWAs) are becoming more sophisticated, offering near-native app experiences through web browsers. With improved caching strategies and offline capabilities, PWAs are bridging the gap between web and mobile applications.

WebAssembly (WASM) is opening up new possibilities for web applications, allowing developers to run high-performance code written in languages like Rust, C++, and Go directly in the browser.`,
    imageUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    createdAt: '2025-01-15T10:00:00Z',
    author: 'Sarah Johnson'
  },
  {
    _id: '2',
    title: 'Building Responsive Layouts with CSS Grid and Flexbox',
    content: `Creating responsive layouts is a fundamental skill for modern web developers. CSS Grid and Flexbox provide powerful tools for building flexible, maintainable layouts that work across all devices.

CSS Grid excels at creating two-dimensional layouts, allowing you to control both rows and columns with precision. It's perfect for complex page layouts, card-based designs, and any scenario where you need precise control over element placement.

Flexbox, on the other hand, is ideal for one-dimensional layouts. It's perfect for navigation bars, centering content, and creating flexible components that adapt to their container's size.

The key to mastering responsive design is understanding when to use each tool. Grid is your go-to for page-level layouts, while Flexbox shines for component-level arrangements.

Media queries remain essential for responsive design, but with Grid and Flexbox, you'll find you need fewer breakpoints. These layout methods are inherently flexible and can adapt to various screen sizes without extensive media query overrides.

Container queries are an emerging technology that will revolutionize responsive design. Instead of responding to viewport size, elements can respond to their container's dimensions, enabling truly modular responsive components.

CSS custom properties (variables) play a crucial role in responsive design, allowing you to create dynamic values that change based on conditions. This creates more maintainable and flexible stylesheets.`,
    imageUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: '2025-01-12T14:30:00Z',
    author: 'Mike Chen'
  },
  {
    _id: '3',
    title: 'JavaScript Performance Optimization Techniques',
    content: `Performance optimization is crucial for creating fast, responsive web applications. JavaScript, being the engine that powers modern web apps, requires special attention to ensure optimal performance.

Understanding the JavaScript engine's behavior is the first step toward optimization. Modern engines like V8 use just-in-time compilation and various optimization techniques that developers can leverage.

Memory management is critical in JavaScript applications. Avoiding memory leaks, understanding garbage collection, and using appropriate data structures can significantly impact performance.

Event delegation is a powerful technique for handling events efficiently, especially when dealing with large numbers of similar elements. Instead of attaching event listeners to individual elements, delegate to a parent container.

Debouncing and throttling are essential techniques for controlling the frequency of function execution, particularly useful for scroll, resize, and input events that can fire rapidly.

Code splitting and lazy loading help reduce initial bundle sizes and improve load times. Modern bundlers like webpack and Vite make implementing these techniques straightforward.

Web Workers allow you to run JavaScript in the background, preventing heavy computations from blocking the main thread and keeping your UI responsive.

The Performance API provides valuable insights into your application's runtime behavior, helping you identify bottlenecks and measure the impact of optimizations.`,
    imageUrl: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: '2025-01-10T09:15:00Z',
    author: 'Emma Rodriguez'
  },
  {
    _id: '4',
    title: 'Getting Started with React Server Components',
    content: `React Server Components represent a paradigm shift in how we think about React applications. They enable us to render components on the server, reducing bundle sizes and improving performance.

Server Components run exclusively on the server, allowing them to access databases, file systems, and other server-only resources directly. This eliminates the need for API endpoints for many data-fetching scenarios.

The key benefit of Server Components is that they don't add to your JavaScript bundle size. They render on the server and send HTML to the client, resulting in faster initial page loads and better Core Web Vitals scores.

Understanding the boundary between Server and Client Components is crucial. Server Components can't use browser-only APIs or event handlers, while Client Components run in the browser with full interactivity.

Data fetching with Server Components is straightforward since they can directly access your data sources. No more useEffect hooks or loading states for initial data - it's all handled on the server.

Streaming allows Server Components to send partial responses to the client as they become available, improving perceived performance and enabling progressive rendering.

The integration with Suspense boundaries creates powerful patterns for handling loading states and error boundaries in a more declarative way.

Migration from traditional React apps requires careful planning, but the performance benefits and improved developer experience make it worthwhile for many applications.`,
    imageUrl: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=TQQPAU21ZUw',
    createdAt: '2025-01-08T16:45:00Z',
    author: 'David Park'
  },
  {
    _id: '5',
    title: 'Modern CSS Features You Should Be Using',
    content: `CSS continues to evolve with powerful new features that make styling more intuitive and efficient. Let's explore some modern CSS capabilities that can enhance your development workflow.

CSS Custom Properties (variables) have revolutionized how we manage styles. They enable dynamic theming, reduce repetition, and make maintenance much easier compared to preprocessor variables.

CSS Grid Layout has matured into a robust system for creating complex layouts. With features like subgrid, named lines, and implicit grids, you can create sophisticated designs with minimal code.

Container Queries allow elements to respond to their container's size rather than the viewport, enabling truly modular responsive components that work in any context.

CSS Logical Properties provide internationalization-friendly ways to specify directions and dimensions, making your styles work better with different writing modes and languages.

The :has() pseudo-class (the "parent selector") enables powerful styling patterns that were previously impossible with CSS alone, reducing the need for JavaScript-based styling solutions.

CSS Cascade Layers provide better control over specificity and style precedence, making it easier to manage large stylesheets and integrate third-party styles.

Modern color functions like oklch() and color-mix() offer more intuitive ways to work with colors, providing better perceptual uniformity and mixing capabilities.

CSS Subgrid extends Grid Layout to nested elements, solving long-standing alignment challenges in complex layouts.`,
    imageUrl: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: '2025-01-05T11:20:00Z',
    author: 'Lisa Wang'
  },
  {
    _id: '6',
    title: 'Building Accessible Web Applications',
    content: `Web accessibility ensures that digital experiences are usable by everyone, including people with disabilities. Building accessible applications isn't just about compliance - it's about creating inclusive experiences.

Semantic HTML forms the foundation of accessible web development. Using appropriate HTML elements and attributes provides screen readers and other assistive technologies the context they need.

ARIA (Accessible Rich Internet Applications) attributes enhance semantics when HTML alone isn't sufficient. However, the first rule of ARIA is to not use ARIA if semantic HTML can accomplish the same goal.

Keyboard navigation is essential for users who can't use a mouse or touch screen. Every interactive element should be accessible via keyboard, with clear focus indicators and logical tab order.

Color and contrast play crucial roles in accessibility. Sufficient color contrast ensures text is readable, while not relying solely on color for important information helps users with color vision deficiencies.

Images require alternative text that describes their content or function. Decorative images should have empty alt attributes, while informative images need descriptive alternatives.

Form accessibility involves proper labeling, clear error messages, and logical grouping of related fields. Users should understand what's expected and receive helpful feedback when errors occur.

Screen reader testing is invaluable for understanding how assistive technology users experience your application. Tools like VoiceOver, NVDA, and JAWS provide insights into the accessibility of your interfaces.

Automated testing tools can catch many accessibility issues, but manual testing and user feedback from people with disabilities provide the most valuable insights.`,
    imageUrl: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: '2025-01-03T13:10:00Z',
    author: 'Alex Thompson'
  }
];