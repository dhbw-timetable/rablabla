package wasdev.sample.servlet;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class NoCacheFilter implements Filter {

	public NoCacheFilter() {}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws ServletException, IOException {
		HttpServletResponse resp = (HttpServletResponse) response;
		resp.setHeader("Cache-Control", "no-store, no-cache");
		resp.setHeader("Expires", "0");
		chain.doFilter(new AddParamsToHeader((HttpServletRequest) request), response);
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {}

	@Override
	public void destroy() {}
}
