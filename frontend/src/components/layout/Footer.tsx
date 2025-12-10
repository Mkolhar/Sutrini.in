export function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <span className="text-2xl font-bold tracking-tight">
                            Sutrini<span className="text-purple-500">.</span>
                        </span>
                        <p className="mt-4 text-gray-400 text-sm">
                            Digitizing the art of embroidery. Custom designs, premium quality, delivered to your doorstep.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Shop</h3>
                        <ul className="mt-4 space-y-2 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-white transition">New Arrivals</a></li>
                            <li><a href="#" className="hover:text-white transition">Best Sellers</a></li>
                            <li><a href="#" className="hover:text-white transition">Custom Studio</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Support</h3>
                        <ul className="mt-4 space-y-2 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-white transition">Track Order</a></li>
                            <li><a href="#" className="hover:text-white transition">Shipping & Returns</a></li>
                            <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Legal</h3>
                        <ul className="mt-4 space-y-2 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} Sutrini Studio. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
