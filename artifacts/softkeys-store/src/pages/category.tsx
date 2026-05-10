import { useRoute } from "wouter";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug;

  const { data: categoriesData, isLoading: loadingCat } = useListCategories();
  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const category = categories?.find(c => c.slug === slug);

  const { data: products, isLoading } = useListProducts({ 
    categoryId: category?.id 
  }, { 
    query: { enabled: !!category?.id } 
  });

  if (loadingCat) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Skeleton className="h-12 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto mb-16" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-[380px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!category && !loadingCat) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-2">Categoria Non Trovata</h2>
        <p className="text-muted-foreground">La categoria "{slug}" non esiste.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="bg-card border border-border rounded-2xl p-8 mb-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">{category?.name}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Sfoglia la nostra collezione di software e licenze premium per {category?.name.toLowerCase()}. Consegna istantanea e checkout sicuro.
        </p>
      </div>

      <div className="mb-6 text-muted-foreground text-sm">
        {isLoading ? (
          <Skeleton className="h-5 w-32" />
        ) : (
          <p>Trovati {products?.length || 0} prodotti</p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-[380px] rounded-xl" />
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center border border-dashed border-border rounded-xl bg-card">
          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">Nessun prodotto in questa categoria</h3>
          <p className="text-muted-foreground">Torna a controllare presto per le nuove aggiunte.</p>
        </div>
      )}
    </div>
  );
}
