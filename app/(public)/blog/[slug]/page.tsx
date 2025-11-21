'use client';

import GoogleAds from '@/components/GoogleAds';

// Example blog post component with in-article ad
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // In a real app, you would fetch the blog post data here
  const blogPost = {
    title: 'Getting Started with Sports Equipment',
    slug: params.slug,
    content: `
      <p>Welcome to our comprehensive guide on getting started with sports equipment. Whether you're a beginner or looking to upgrade your gear, this article will help you make informed decisions.</p>
      
      <h2>Understanding Your Needs</h2>
      <p>Before purchasing any sports equipment, it's essential to understand your specific needs. Consider factors such as:</p>
      <ul>
        <li>Your skill level</li>
        <li>The type of sport you're participating in</li>
        <li>Your budget constraints</li>
        <li>Frequency of use</li>
      </ul>
      
      <h2>Quality vs. Price</h2>
      <p>When it comes to sports equipment, the age-old debate between quality and price is always relevant. While it's tempting to go for the cheapest option, investing in quality equipment can save you money in the long run.</p>
      
      <p>High-quality equipment tends to last longer, perform better, and provide better safety features. However, this doesn't mean you need to break the bank. Many mid-range options offer excellent value for money.</p>
      
      <h2>Maintenance and Care</h2>
      <p>Proper maintenance is crucial for extending the life of your sports equipment. Regular cleaning, proper storage, and timely repairs can significantly impact how long your gear lasts.</p>
      
      <p>Make sure to follow manufacturer guidelines for care and maintenance. This will not only keep your equipment in good condition but also ensure your safety while using it.</p>
      
      <h2>Where to Buy</h2>
      <p>There are several options when it comes to purchasing sports equipment:</p>
      <ul>
        <li>Specialty sports stores</li>
        <li>Online marketplaces</li>
        <li>Second-hand options</li>
        <li>Direct from manufacturers</li>
      </ul>
      
      <p>Each option has its pros and cons. Specialty stores offer expert advice but may be more expensive. Online marketplaces provide convenience and competitive pricing but require careful research.</p>
      
      <h2>Conclusion</h2>
      <p>Choosing the right sports equipment is a personal journey that depends on your individual needs and circumstances. Take your time, do your research, and don't hesitate to ask for advice from experienced athletes or coaches.</p>
      
      <p>Remember, the best equipment is the one that helps you enjoy your sport safely and effectively. Happy training!</p>
    `,
  };

  return (
    <div className="min-h-screen">
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {blogPost.title}
          </h1>
          <div className="text-white/70 text-sm">
            Published on {new Date().toLocaleDateString()}
          </div>
        </header>

        <div className="prose prose-invert max-w-none">
          {/* First paragraph */}
          <div 
            className="text-white/90 leading-relaxed mb-6"
            dangerouslySetInnerHTML={{ __html: blogPost.content.split('<h2>')[0] }}
          />

          {/* In-Article Ad - First position */}
          <div className="my-8">
            <GoogleAds
              adSlot="YOUR_AD_SLOT_ID_IN_ARTICLE_1"
              adFormat="auto"
              adLayout="in-article"
              fullWidthResponsive={true}
              className="w-full"
              minHeight="250px"
            />
          </div>

          {/* Rest of content */}
          <div 
            className="text-white/90 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: '<h2>' + blogPost.content.split('<h2>').slice(1).join('<h2>')
            }}
          />

          {/* In-Article Ad - Second position */}
          <div className="my-8">
            <GoogleAds
              adSlot="YOUR_AD_SLOT_ID_IN_ARTICLE_2"
              adFormat="auto"
              adLayout="in-article"
              fullWidthResponsive={true}
              className="w-full"
              minHeight="250px"
            />
          </div>
        </div>
      </article>
    </div>
  );
}

