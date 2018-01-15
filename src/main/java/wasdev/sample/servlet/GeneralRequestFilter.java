package wasdev.sample.servlet;

import java.io.IOException;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;

public class GeneralRequestFilter implements Filter {

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws ServletException, IOException {
		System.out.println("111111111111111111111111111111111111111");
		HttpServletResponse resp = (HttpServletResponse) response;
		if (request.isSecure()) {
			resp.setHeader("Strict-Transport-Security", "max-age=31622400; includeSubDomains; preload");
			resp.setHeader("X-Frame-Options", "SAMEORIGIN");
			resp.setHeader("X-XSS-Protection", "1; mode=block");
			resp.setHeader("X-Content-Type-Options", "nosniff");
			resp.setHeader("Content-Security-Policy", " default-src https:; style-src 'unsafe-inline' 'self'; img-src 'self' http://lorempizza.com/100/500; script-src 'unsafe-eval' 'self'");
			resp.setHeader("Referrer-Policy", "no-referrer");
		}
		chain.doFilter(new AddParamsToHeader((HttpServletRequest) request), response);
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException { }

	@Override
	public void destroy() { }
}

class AddParamsToHeader extends HttpServletRequestWrapper {
    public AddParamsToHeader(HttpServletRequest request) { super(request); }

    public String getHeader(String name) {
        String header = super.getHeader(name);
        return header != null ? header : super.getParameter(name); // Note: you can't use getParameterValues() here.
    }

    public Enumeration<String> getHeaderNames() {
        List<String> names = Collections.list(super.getHeaderNames());
        names.addAll(Collections.list(super.getParameterNames()));
        return Collections.enumeration(names);
    }
}
