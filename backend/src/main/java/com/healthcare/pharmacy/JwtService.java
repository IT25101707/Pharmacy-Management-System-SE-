package com.healthcare.pharmacy;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class JwtService {
  private final SecretKey key;
  public JwtService(@Value("${app.jwt-secret}") String secret) { key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); }
  public String create(Map<String,Object> user) {
    Map<String,Object> claims=new LinkedHashMap<>();
    claims.put("id",user.get("id"));
    claims.put("name",user.get("name"));
    claims.put("email",user.get("email"));
    claims.put("role",user.get("role"));
    claims.put("branchId",user.get("branchId"));
    claims.put("customerId",user.get("customerId"));
    return Jwts.builder().claims(claims).subject(String.valueOf(user.get("id"))).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()+8*60*60*1000)).signWith(key).compact();
  }
  public Map<String,Object> parse(String token) { return new HashMap<>(Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload()); }
}
