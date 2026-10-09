package com.healthcare.pharmacy;

import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.*;
import java.io.IOException;
import java.util.Map;

@Configuration
public class WebConfig implements WebMvcConfigurer {
  private final JwtService jwt; private final String origin;
  public WebConfig(JwtService jwt,@Value("${app.cors-origin}") String origin){this.jwt=jwt;this.origin=origin;}
  @Override public void addCorsMappings(CorsRegistry r){r.addMapping("/api/**").allowedOrigins(origin,"http://127.0.0.1:5173").allowedMethods("GET","POST","PUT","DELETE","OPTIONS").allowedHeaders("*");}
  @Override public void addInterceptors(InterceptorRegistry r){r.addInterceptor(new HandlerInterceptor(){
    @Override public boolean preHandle(HttpServletRequest q,HttpServletResponse s,Object h)throws IOException{
      if(q.getRequestURI().equals("/api/auth/login")||q.getRequestURI().equals("/api/auth/customer-register")||q.getRequestURI().equals("/api/health")||q.getMethod().equals("OPTIONS"))return true;
      String a=q.getHeader("Authorization"); if(a==null||!a.startsWith("Bearer "))return fail(s,"Login required");
      try{Map<String,Object> u=jwt.parse(a.substring(7));String path=q.getRequestURI();if("CUSTOMER".equals(String.valueOf(u.get("role")))&&!path.startsWith("/api/customer/")&&!path.equals("/api/profile"))return forbidden(s);q.setAttribute("user",u);return true;}catch(Exception e){return fail(s,"Invalid token");}
    }
    boolean fail(HttpServletResponse s,String m)throws IOException{s.setStatus(HttpStatus.UNAUTHORIZED.value());s.setContentType("application/json");s.getWriter().write("{\"message\":\""+m+"\"}");return false;}
    boolean forbidden(HttpServletResponse s)throws IOException{s.setStatus(HttpStatus.FORBIDDEN.value());s.setContentType("application/json");s.getWriter().write("{\"message\":\"Customer access is limited to your own account\"}");return false;}
  }).addPathPatterns("/api/**");}
}
