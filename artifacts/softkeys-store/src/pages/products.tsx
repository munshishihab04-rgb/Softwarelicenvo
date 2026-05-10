import { useState } from "react";
import { useLocation } from "wouter";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Products() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(
    searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : null
  );
  const [type, setType] = useState<"key" | "subscription" | null>(
    (searchParams.get("type") as "key" | "subscription") || null
  );
  const [onSale, setOnSale] = useState(searchParams.get("onSale") === "true");

  const { data: categories } = useListCategories();
  
  const queryParams = {
    search: search || null,
    categoryId: activeCategoryId,
    type,
    onSale: onSale || null,
  };

  const { data: products, isLoading } = useListProducts(queryParams);

  const clearFilters = () => {
    setSearch("");
    setActiveCategoryId(null);
    setType(null);
    setOnSale(false);
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold mb-4">Categorie</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="cat-all" 
              checked={activeCategoryId === null}
              onCheckedChange={() => setActiveCategoryId(null)}
            />
            <label htmlFor="cat-all" className="text-sm font-medium leading-none cursor-pointer">
              Tutte le Categorie
            </label>
          </div>
          {categories?.map(c => (
            <div key={c.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`cat-${c.id}`} 
                checked={activeCategoryId === c.id}
                onCheckedChange={() => setActiveCategoryId(c.id)}
              />
              <label htmlFor={`cat-${c.id}`} className="text-sm font-medium leading-none cursor-pointer">
                {c.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Tipo di Prodotto</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="type-all" 
              checked={type === null}
              onCheckedChange={() => setType(null)}
            />
            <label htmlFor="type-all" className="text-sm font-medium leading-none cursor-pointer">
              Tutti i Tipi
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="type-key" 
              checked={type === "key"}
              onCheckedChange={() => setType("key")}
            />
            <label htmlFor="type-key" className="text-sm font-medium leading-none cursor-pointer">
              Chiavi di Licenza
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="type-sub" 
              checked={type === "subscription"}
              onCheckedChange={() => setType("subscription")}
            />
            <label htmlFor="type-sub" className="text-sm font-medium leading-none cursor-pointer">
              Abbonamenti
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Offerte Speciali</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="offer-sale" 
              checked={onSale}
              onCheckedChange={(checked) => setOnSale(!!checked)}
            />
            <label htmlFor="offer-sale" className="text-sm font-medium leading-none cursor-pointer">
              In Offerta / Sconti
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Desktop */}
        <aside className="w-full md:w-64 shrink-0 hidden md:block border-r border-border pr-8">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Filtri</h2>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground h-8 px-2">
                Azzera
              </Button>
            </div>
            <FilterSidebar />
          </div>
        </aside>

        {/* Contenuto principale */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Cerca prodotti..." 
                className="pl-9 h-12 bg-card"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground"
                  onClick={() => setSearch("")}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Filtri Mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-12 md:hidden">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtri
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="mb-6 text-left">
                  <SheetTitle>Filtri</SheetTitle>
                </SheetHeader>
                <FilterSidebar />
                <Button variant="outline" className="w-full mt-8" onClick={clearFilters}>
                  Azzera tutti i filtri
                </Button>
              </SheetContent>
            </Sheet>
          </div>

          {/* Risultati */}
          <div className="mb-6 text-muted-foreground text-sm">
            {isLoading ? (
              <Skeleton className="h-5 w-32" />
            ) : (
              <p>Trovati {products?.length || 0} risultati</p>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[380px] rounded-xl" />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center border border-dashed border-border rounded-xl bg-card">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">Nessun prodotto trovato</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Non abbiamo trovato prodotti corrispondenti ai filtri selezionati. Prova a modificare la ricerca o a rimuovere qualche filtro.
              </p>
              <Button onClick={clearFilters}>Azzera tutti i filtri</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
