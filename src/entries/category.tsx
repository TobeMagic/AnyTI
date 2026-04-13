import ReactDOM from 'react-dom/client';
import { CategoryPage } from '@/pages/CategoryPage';
import '@/styles.css';

const root = document.getElementById('app')!;
const slug = root.dataset.categorySlug;

if (!slug) {
  throw new Error('Missing data-category-slug on category entry.');
}

ReactDOM.createRoot(root).render(<CategoryPage slug={slug} />);
